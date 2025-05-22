package edu.stevens.cs522.chat.web.request;

import android.net.Uri;
import android.os.Parcel;

import edu.stevens.cs522.base.EnumUtils;
import edu.stevens.cs522.chat.web.RequestProcessor;

/**
 * Created by dduggan.
 */

public class RegisterRequest extends ChatServiceRequest {

    private static final String TAG = ChatServiceRequest.class.getCanonicalName();

    public Uri chatServer;

    // public String chatname;

    public RegisterRequest(Uri chatServer, String chatname) {
        super();
        this.chatServer = chatServer;
        this.chatName = chatname;
    }

    @Override
    public ChatServiceResponse getResponse(){
        return new RegisterResponse();
    }

    @Override
    public ChatServiceResponse process(RequestProcessor processor) {
        return processor.perform(this);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        EnumUtils.writeEnum(dest, RequestType.REGISTER);
        dest.writeString(chatServer.toString());
    }

    public RegisterRequest(Parcel in) {
        super(in);
        this.chatServer = Uri.parse(in.readString());
    }

    public static Creator<RegisterRequest> CREATOR = new Creator<RegisterRequest>() {
        @Override
        public RegisterRequest createFromParcel(Parcel in) {
            EnumUtils.readEnum(RequestType.class, in);
            return new RegisterRequest(in);
        }

        @Override
        public RegisterRequest[] newArray(int size) {
            return new RegisterRequest[size];
        }
    };

}
