package edu.stevens.cs522.chatserver.viewmodels;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import java.util.List;

import edu.stevens.cs522.chatserver.databases.ChatDatabase;
import edu.stevens.cs522.chatserver.entities.Message;
import edu.stevens.cs522.chatserver.entities.Peer;

public class PeerViewModel extends AndroidViewModel {

    public final static String TAG = PeerViewModel.class.getCanonicalName();

    private ChatDatabase chatDatabase;

    private LiveData<List<Message>> messages;

    private Peer currentPeer;

    public PeerViewModel(Application context) {
        super(context);
        Log.d(TAG, "Getting database in PeerViewModel");
        chatDatabase = ChatDatabase.getInstance(context);
    }


    public LiveData<List<Message>> fetchMessagesFromPeer(Peer peer) {
        // TODO finish this
        if (messages == null || (currentPeer !=null && currentPeer.id != peer.id)) {
            messages = loadMessages(peer);
        }
        return messages;

//        return null;
    }

    private LiveData<List<Message>> loadMessages(Peer peer) {
        currentPeer = peer;
        return chatDatabase.messageDao().fetchMessagesFromPeer(peer.name);
    }

    @Override
    public void onCleared() {
        super.onCleared();
        Log.d(TAG, "Clearing PeerViewodel...");
        chatDatabase = null;
    }
}
