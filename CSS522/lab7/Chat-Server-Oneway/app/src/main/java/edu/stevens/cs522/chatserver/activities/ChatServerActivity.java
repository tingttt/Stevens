/*********************************************************************

    Chat server: accept chat messages from clients.
    
    Sender name and GPS coordinates are encoded
    in the messages, and stripped off upon receipt.

    Copyright (c) 2017 Stevens Institute of Technology

**********************************************************************/
package edu.stevens.cs522.chatserver.activities;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.JsonReader;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import java.io.StringReader;
import java.time.Instant;
import java.util.Date;

import edu.stevens.cs522.base.Datagram;
import edu.stevens.cs522.base.DatagramConnectionFactory;
import edu.stevens.cs522.base.IDatagramConnection;
import edu.stevens.cs522.chatserver.R;
import edu.stevens.cs522.chatserver.databases.ChatDatabase;
import edu.stevens.cs522.chatserver.entities.Chatroom;
import edu.stevens.cs522.chatserver.entities.Message;
import edu.stevens.cs522.chatserver.entities.Peer;
import edu.stevens.cs522.chatserver.entities.TimestampConverter;
import edu.stevens.cs522.chatserver.viewmodels.SharedViewModel;

public class ChatServerActivity extends AppCompatActivity implements ChatroomsFragment.IChatroomListener, MessagesFragment.IChatListener {

	final static public String TAG = ChatServerActivity.class.getCanonicalName();

    public final static String SENDER_NAME = "name";

    public final static String CHATROOM = "room";

    public final static String MESSAGE_TEXT = "text";

    public final static String TIMESTAMP = "timestamp";

    public final static String LATITUDE = "latitude";

    public final static String LONGITUDE = "longitude";

    /*
     * Fragments for two-pane UI
     */
    private final static String SHOWING_CHATROOMS_TAG = "INDEX-FRAGMENT";

    private final static String SHOWING_MESSAGES_TAG = "CHAT-FRAGMENT";

    private boolean isTwoPane;

    /*
     * Shared with both the index and detail fragments
     */
    private SharedViewModel sharedViewModel;

    /*
     * Provides the operations for inserting messages and upsertig peers.
     */
    private ChatDatabase chatDatabase;


    /*
	 * Socket used both for sending and receiving.
	 *
	 * This should also be in a view model!
	 */
    private IDatagramConnection serverConnection;

    /*
     * True as long as we don't get socket errors
     */
    private boolean socketOK = true;

    /*
     * Callback for Back
     */
    private OnBackPressedCallback callback;
	
	/*
	 * Called when the activity is first created. 
	 */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		Log.i(TAG, "(Re)starting ChatServer activity....");

        /**
         * Let's be clear, this is a HACK to allow you to do network communication on the messages thread.
         * This WILL cause an ANR, and is only provided to simplify the pedagogy.  We will see how to do
         * this right in a future assignment (using a Service managing background threads).
         */
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        try {
            /*
             * Get port information from the resources.
             */
            int port = getResources().getInteger(R.integer.app_port);

        DatagramConnectionFactory factory = new DatagramConnectionFactory();
            serverConnection = factory.getUdpConnection(port);

        } catch (Exception e) {
            throw new IllegalStateException("Cannot open socket", e);
        }

        /*
         * Initialize the UI with the index and details fragments
         */
        setContentView(R.layout.chat_activity);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.chat_activity), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // TODO get shared view model for current chatroom (make sure it is initially null!)

        sharedViewModel = new ViewModelProvider(this).get(SharedViewModel.class);
        sharedViewModel.select(null);
        // TODO get database reference (for insertions)
        chatDatabase  = ChatDatabase.getInstance(getApplicationContext());

        isTwoPane = getResources().getBoolean(R.bool.is_two_pane);
        if (isTwoPane) {
            // TODO In two-pane mode, need to prevent exiting app when a chat room is open (see setChatroom).
            callback = new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    sharedViewModel.select(null);
                    getSupportFragmentManager()
                            .beginTransaction()
                            .replace(R.id.messages_fragment, new MessagesFragment(), SHOWING_MESSAGES_TAG)
                            .commit();
                    setEnabled(false);
                }
            };
            getOnBackPressedDispatcher().addCallback(this, callback);
            callback.setEnabled(false);

        } else {
            /*
             * Add an index fragment as the fragment in the frame layout (single-pane layout)
             */
            getSupportFragmentManager()
                    .beginTransaction()
                    .add(R.id.fragment, new ChatroomsFragment(),SHOWING_CHATROOMS_TAG)
                    // Don't add this (why not?): .addToBackStack(SHOWING_CHATROOMS_TAG)
                    .commit();
        }


    }

	@Override
    /**
     * Called by the MessagesFragment to get the next message (synchronously!)
     */
    public void nextMessage() {

		Datagram receivePacket = new Datagram();

		try {

            String sender = null;

            String room = null;

            String text = null;

            Instant timestamp = null;

            Double latitude = null;

            Double longitude = null;

            /*
             * THere is an apparent bug in the emulator stack on Windows where
             * messages can arrive empty, we loop as a workaround.
             */

            serverConnection.receive(receivePacket);
            Log.d(TAG, "Received a packet");

            Log.d(TAG, "Source Address: " + receivePacket.getAddress());

            String content = receivePacket.getData();
            Log.d(TAG, "Message received: " + content);

            /*
             * Parse the JSON object
             */
            JsonReader rd = new JsonReader(new StringReader(content));

            rd.beginObject();
            if (SENDER_NAME.equals(rd.nextName())) {
                sender = rd.nextString();
            }
            if (CHATROOM.equals(rd.nextName())) {
                room = rd.nextString();
            }
            if (MESSAGE_TEXT.equals((rd.nextName()))) {
                text = rd.nextString();
            }
            if (TIMESTAMP.equals(rd.nextName())) {
                timestamp = TimestampConverter.deserialize(rd.nextString());
            }
            if (LATITUDE.equals(rd.nextName())) {
                latitude = rd.nextDouble();
            }
            if (LONGITUDE.equals((rd.nextName()))) {
                longitude = rd.nextDouble();
            }
            rd.endObject();

            rd.close();

            /*
             * Add the sender to our list of senders
             */
            Chatroom chatroom = new Chatroom();
            chatroom.name = room;

            Peer peer = new Peer();
            peer.name = sender;

            peer.timestamp = timestamp;
            peer.latitude = latitude;
            peer.longitude = longitude;

            Message message = new Message();
            message.messageText = text;
            message.chatroom = room;
            message.sender = sender;
            message.timestamp = timestamp;
            message.latitude = latitude;
            message.longitude = longitude;

            /*
			 * TODO upsert chatroom and peer, and insert message into the database
			 */
            chatDatabase.chatroomDao().insert(chatroom);
            chatDatabase.peerDao().upsert(peer);
            chatDatabase.messageDao().persist(message);
            /*
             * End TODO
             *
             * The livedata for the messages should update via observer automatically.
             */

            /*
             * Let the user know which chatroom received a message.
             */
            String updateMessage = getString(R.string.message_received, message.chatroom);
            Toast.makeText(this, updateMessage, Toast.LENGTH_LONG).show();

		} catch (Exception e) {
			
			Log.e(TAG, "Problems receiving packet: " + e.getMessage(), e);
			socketOK = false;
		} 

	}

	/*
	 * Close the socket before exiting application
	 */
	public void closeSocket() {
	    if (serverConnection != null) {
            serverConnection.close();
            serverConnection = null;
        }
	}

	/*
	 * If the socket is OK, then it's running
	 */
	boolean socketIsOK() {
		return socketOK;
	}

    public void onDestroy() {
        super.onDestroy();
        closeSocket();
        Log.i(TAG, "Leaving ChatServer activity....");
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        // TODO inflate a menu with PEERS option
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.chatserver_menu, menu);

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);
        int itemId = item.getItemId();
        if (itemId == R.id.peers) {
            // TODO PEERS provide the UI for viewing list of peers
            // The subactivity will query the database for the list of peers.
            Intent intent = new Intent(this, ViewPeersActivity.class);
            startActivity(intent);
            return true;

        }
        return false;
    }

    @Override
    /**
     * Called by the ChatroomsFragment when a chatroom is selected.
     *
     * For two-pane UI, do nothing, but for single-pane, need to push the detail fragment.
     */
    public void setChatroom(Chatroom chatroom) {
        sharedViewModel.select(chatroom);
        if (isTwoPane) {
            // TODO for two pane, enable Back callback if we are entering a chatroom
            if (callback != null) {
                callback.setEnabled(chatroom != null);
            }
        } else {
            // TODO For single pane, replace chatrooms fragment with messages fragment.
            // Add chatrooms fragment to backstack, so pressing BACK key will return to index.

            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment, new MessagesFragment())
                    .addToBackStack(SHOWING_CHATROOMS_TAG)
                    .commit();

        }
    }

}
