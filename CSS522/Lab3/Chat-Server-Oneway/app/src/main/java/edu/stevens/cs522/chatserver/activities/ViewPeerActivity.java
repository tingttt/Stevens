package edu.stevens.cs522.chatserver.activities;

import android.content.Intent;
import android.database.Cursor;
import android.os.Build;
import android.os.Bundle;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.loader.app.LoaderManager;
import androidx.loader.content.CursorLoader;
import androidx.loader.content.Loader;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import edu.stevens.cs522.chatserver.R;
import edu.stevens.cs522.chatserver.contracts.MessageContract;
import edu.stevens.cs522.chatserver.entities.Peer;

/**
 * Created by dduggan.
 */

public class ViewPeerActivity extends FragmentActivity implements LoaderManager.LoaderCallbacks<Cursor> {

    private static final String TAG = ViewPeerActivity.class.getCanonicalName();

    public static final String PEER_KEY = "peer";

    private Peer peer;

    /*
     * UI for messages sent by this peer
     */
    private ListView messageList;

    private SimpleCursorAdapter messagesAdapter;

    static final private int LOADER_ID = 3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.view_peer);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.view_peer), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        peer = getPeer(getIntent());
        if (peer == null) {
            throw new IllegalArgumentException("Expected peer as intent extra");
        }

        // TODO Set the fields of the UI
        TextView username = this.findViewById(R.id.view_user_name);
        TextView timestamp = this.findViewById(R.id.view_timestamp);
        TextView location = this.findViewById(R.id.view_location);

        username.setText(getString(R.string.view_user_name, peer.name));
        timestamp.setText(getString(R.string.view_timestamp, formatTimestamp(peer.timestamp)));
        location.setText(getString(R.string.view_location, peer.latitude, peer.longitude));


        // TODO use SimpleCursorAdapter (with flags=0 and null initial cursor) to display the messages received.
        // You can use android.R.simple_list_item_1 as layout for each row.
        String[] from = new String[] {MessageContract.MESSAGE_TEXT};
        int[] to = new int[] { R.id.message };
        messagesAdapter = new SimpleCursorAdapter(this, R.layout.message, null, from, to, 0);
        messageList = this.findViewById(R.id.message_list);
        messageList.setAdapter(messagesAdapter);

        // TODO Use loader manager to initiate a query of the database
        // Make sure to use the Jetpack library, not the deprecated core implementation.

        LoaderManager.getInstance(this).initLoader(LOADER_ID, null, this);
    }

    private static String formatTimestamp(Instant timestamp) {
        LocalDateTime dateTime = timestamp.atZone(ZoneId.systemDefault()).toLocalDateTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        return dateTime.format(formatter);
    }

    private static Peer getPeer(Intent intent) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            return intent.getParcelableExtra(PEER_KEY, Peer.class);
        } else {
            return intent.getParcelableExtra(PEER_KEY);
        }
    }

    @NonNull
    @Override
    public Loader<Cursor> onCreateLoader(int id, Bundle args) {
        switch (id) {
            case LOADER_ID:
                String selection = (MessageContract.SENDER + "=?");
                String[] selectionArgs = { peer.name };
                // TODO use a CursorLoader to initiate a query on the database

                return new CursorLoader(
                        this,              // Context (e.g., Activity or Fragment)
                        MessageContract.CONTENT_URI, // URI of the content provider
                        null,            // Projection (columns to retrieve - null means all)
                        selection,       // Selection (WHERE clause)
                        selectionArgs,   // Selection arguments
                        null             // Sort order
                );
            default:
                throw new IllegalStateException(("Unexpected loader id: " + id));
        }
    }

    @Override
    public void onLoadFinished(@NonNull Loader<Cursor> loader, Cursor data) {
        // TODO populate the UI with the result of querying the provider
        messagesAdapter.swapCursor(data);
    }

    @Override
    public void onLoaderReset(@NonNull Loader<Cursor> loader) {
        // TODO reset the UI when the cursor is empty
        messagesAdapter.swapCursor(null);
    }
}
