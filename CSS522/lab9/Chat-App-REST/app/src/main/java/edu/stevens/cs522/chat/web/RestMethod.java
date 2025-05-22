package edu.stevens.cs522.chat.web;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

import edu.stevens.cs522.chat.R;
import edu.stevens.cs522.chat.settings.Settings;
import edu.stevens.cs522.chat.web.client.ExcludeStrategy;
import edu.stevens.cs522.chat.web.client.HeaderInterceptor;
import edu.stevens.cs522.chat.web.client.ServerApi;
import edu.stevens.cs522.chat.web.client.TimestampSerializer;
import edu.stevens.cs522.chat.web.client.UUIDSerializer;
import edu.stevens.cs522.chat.web.request.ChatServiceRequest;
import edu.stevens.cs522.chat.web.request.ChatServiceResponse;
import edu.stevens.cs522.chat.web.request.ErrorResponse;
import edu.stevens.cs522.chat.web.request.PostMessageRequest;
import edu.stevens.cs522.chat.web.request.PostMessageResponse;
import edu.stevens.cs522.chat.web.request.RegisterRequest;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by dduggan.
 */

public class RestMethod {

    private static final String TAG = RestMethod.class.getCanonicalName();

    protected static final int UNAVAILABLE_CODE = 503;

    protected static final String UNAVAILABLE_MESSAGE = "Service Unavailable";

    private static final boolean DEBUG = true;

    public static final Charset CHARSET = StandardCharsets.UTF_8;



    /*
     * HTTP Request headers
     */
    public final static String CONTENT_TYPE = "CONTENT-TYPE";

    public final static String ACCEPT = "ACCEPT";

    public final static String USER_AGENT = "USER-AGENT";

    public final static String CONNECTION = "CONNECTION";

    /*
     * MIME types
     */
    public final static String JSON_TYPE = "application/json";

    /*
     * Timeouts
     */
    public final static int SERVICE_DURATION = 5000;


    /*
     * HTTP response
     */
    public static final String LOCATION_HEADER = "Location";

    private final Context context;

    private final Gson gson;


    public RestMethod(Context context) {
        this.context = context;
        /*
         * Create the GSON parser/unparser.
         */
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(Instant.class, new TimestampSerializer())
                   .registerTypeAdapter(UUID.class, new UUIDSerializer())
                   .setExclusionStrategies(new ExcludeStrategy());
        this.gson = gsonBuilder.create();
    }

    public Gson getGson() {
        return gson;
    }

    /*
     * Create a retrofit client stub around an OkHttp client.
     */
    protected ServerApi createClient(Uri serverUri, ChatServiceRequest request) {
        /*
         * Create the HTTP client stub.
         */
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        Interceptor interceptor = new HeaderInterceptor(request, buildUserAgent(context));
        builder.interceptors().add(interceptor);
        OkHttpClient client = builder.build();

        /*
         * TODO Wrap the okhttp client with a retrofit stub factory.
         */
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(serverUri.toString())
                .addConverterFactory(GsonConverterFactory.create(this.gson))
                .client(client)
                .build();
        return retrofit.create(ServerApi.class);
    }


    public ChatServiceResponse perform(RegisterRequest request) {
        try {
            Log.d(TAG, "Performing REST method for registration....");
            ServerApi server = createClient(request.registerUrl, request);
            Response<Void> response = null;
            // TODO execute the Web service call

            Call<Void> Scall = server.register(request.chatName);
            response = Scall.execute();
            Log.d(TAG, "executed response" + response);


            if (response.isSuccessful()) {
                Log.d(TAG, "Received positive response from the server: "+response.code());
                return request.getResponse();
            } else {
                Log.d(TAG, "Received negative response from the server: "+response.code());
                ErrorResponse errorResponse = new ErrorResponse();
                errorResponse.responseCode = response.code();
                errorResponse.responseMessage = response.message();
                errorResponse.errorMessage = String.format("Failed to register %s", request.chatName);
                return errorResponse;
            }

        } catch (IOException e) {
            Log.e(TAG, "Registration: Web service error.", e);
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.responseCode = UNAVAILABLE_CODE;
            errorResponse.responseMessage = UNAVAILABLE_MESSAGE;
            errorResponse.errorMessage = e.getMessage();
            return errorResponse;
        }
    }

    /*
     * HTTP response header with URI for new resource when we get 201 created.
     */

    public ChatServiceResponse perform(PostMessageRequest request) {
        try {
            ServerApi server = createClient(Objects.requireNonNull(Settings.getServerUri(context)), request);
            Log.d(TAG, String.format("Uploading \"%s\" in chatroom %s", request.message.messageText, request.message.chatroom));

            Response<Void> response = null;
            ChatServiceResponse callResponse = null;
            // TODO execute the Web service call
            Call<Void> call = server.postMessage(request.chatName,request.message);
            response = call.execute();
            Log.d(TAG, "executed response" + response);

            if (response.isSuccessful()) {
                Log.d(TAG, "Received positive response from the server: "+response.code());
                PostMessageResponse postMessageResponse = (PostMessageResponse) request.getResponse();
                // TODO return the globally unique sequence number assigned by the server to this message
                String locationHeader = response.headers().get(LOCATION_HEADER);
                if (locationHeader != null) {
                    // Extract the message ID from the location header
                    // Assuming format like "/chat/messages/{messageId}"
                    String[] pathSegments = locationHeader.split("/");
                    String messageId = pathSegments[pathSegments.length - 1];
                    postMessageResponse.setMessageId(Long.parseLong(messageId));
                }

                return postMessageResponse;
            } else {
                Log.d(TAG, "Received negative response from the server: "+response.code());
                ErrorResponse errorResponse = new ErrorResponse();
                errorResponse.responseCode = response.code();
                errorResponse.responseMessage = response.message();
                errorResponse.errorMessage = String.format("Failed to upload message: %s", request.message);
                return errorResponse;
            }

        } catch (IOException e) {
            Log.e(TAG, "Posting message: Web service error.", e);
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.responseCode = UNAVAILABLE_CODE;
            errorResponse.responseMessage = UNAVAILABLE_MESSAGE;
            errorResponse.errorMessage = e.getMessage();
            return errorResponse;
        }
    }


    /**
     * Build and return a user-agent string that can identify this application to remote servers. Contains the package
     * name and version code.
     */
    private static String buildUserAgent(Context context) {
        String versionName = "unknown";
        int versionCode = 0;

        try {
            final PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            versionName = info.versionName;
            versionCode = info.versionCode;
        } catch (PackageManager.NameNotFoundException ignored) {
        }

        return context.getPackageName() + "/" + versionName + " (" + versionCode + ") (gzip)";
    }

}
