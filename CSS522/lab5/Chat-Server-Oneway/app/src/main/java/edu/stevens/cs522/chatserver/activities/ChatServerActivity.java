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
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.StringReader;
import java.time.Instant;
import java.util.List;

import edu.stevens.cs522.base.Datagram;
import edu.stevens.cs522.base.DatagramConnectionFactory;
import edu.stevens.cs522.base.IDatagramConnection;
import edu.stevens.cs522.chatserver.R;
import edu.stevens.cs522.chatserver.entities.Message;
import edu.stevens.cs522.chatserver.entities.Peer;
import edu.stevens.cs522.chatserver.entities.TimestampConverter;
import edu.stevens.cs522.chatserver.ui.MessagesAdapter;
import edu.stevens.cs522.chatserver.viewmodels.ChatViewModel;

public class ChatServerActivity extends FragmentActivity implements OnClickListener {

	final static public String TAG = ChatServerActivity.class.getCanonicalName();

    public final static String SENDER_NAME = "name";

    public final static String CHATROOM = "room";

    public final static String MESSAGE_TEXT = "text";

    public final static String TIMESTAMP = "timestamp";

    public final static String LATITUDE = "latitude";

    public final static String LONGITUDE = "longitude";
		
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
     * UI for displayed received messages
     */
    private ChatViewModel chatViewModel;

    private MessagesAdapter messagesAdapter;

    /*
	 * Called when the activity is first created. 
	 */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

        if (savedInstanceState == null) {
            Log.i(TAG, "Starting new ChatServer activity....");
        } else {
            Log.i(TAG, "Restarting ChatServer activity....");
        }

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

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {

            EdgeToEdge.enable(this);

            setContentView(R.layout.view_messages);

            ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.view_messages), (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });

        } else {

            setContentView(R.layout.view_messages);

        }

        RecyclerView messageList = findViewById(R.id.message_list);
        messageList.setLayoutManager(new LinearLayoutManager(this));

        // TODO Initialize the recyclerview and adapter for messages
        RecyclerView recyclerView = messageList;
        messagesAdapter = new MessagesAdapter();
        recyclerView.setAdapter(messagesAdapter);

        // TODO create the view model
        chatViewModel = new ViewModelProvider(this).get(ChatViewModel.class);
        // TODO query the database asynchronously, and use messagesAdapter to display the result
        LiveData<List<Message>> messages = chatViewModel.fetchAllMessages();
        Observer<List<Message>> observer = msg -> {
            messagesAdapter.setMessages(msg);
            messagesAdapter.notifyDataSetChanged();
        };

        messages.observe(this, observer);

        // TODO bind the button for "next" to this activity as listener

        Button next = findViewById(R.id.next);
        next.setOnClickListener(this);
	}

    @Override
    public void onStart() {
        super.onStart();
        Log.i(TAG, "Starting ChatServerActivity");
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.i(TAG, "Resuming ChatServerActivity");
    }

    public void onClick(View v) {

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

            if (receivePacket.getData() == null) {
                Log.d(TAG, "....data missing, skipping....");
                return;
            }

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
			 * TODO upsert peer and insert message into the database
			 */
            message.sender = peer.name;
            chatViewModel.upsert(peer);
            chatViewModel.persist(message);
            /*
             * End TODO
             *
             * The livedata for the messages should update via observer automatically.
             */

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

    @Override
    public void onPause() {
        super.onPause();
        Log.i(TAG, "Pausing ChatServer activity....");
    }

    @Override
    public void onStop() {
        super.onStop();
        Log.i(TAG, "Stopping ChatServer activity....");
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


        getMenuInflater().inflate(R.menu.chatserver_menu, menu);
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

}