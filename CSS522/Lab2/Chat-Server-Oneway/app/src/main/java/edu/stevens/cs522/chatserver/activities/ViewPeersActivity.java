package edu.stevens.cs522.chatserver.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;



import java.util.ArrayList;
import java.util.List;

import edu.stevens.cs522.chatserver.R;
import edu.stevens.cs522.chatserver.entities.Peer;


public class ViewPeersActivity extends Activity implements AdapterView.OnItemClickListener {

    public static final String PEERS_KEY = "peers";

    ArrayAdapter<Peer> peersAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.view_peers);


        List<Peer> peers = getPeers(getIntent());
        if (peers == null) {
            throw new IllegalArgumentException("Missing list of peers!");
        }

        // TODO display the list of peers, set this activity as onItemClick listener
        peers = getIntent().getParcelableArrayListExtra(PEERS_KEY);
        ArrayList<Peer> peerNames = new ArrayList<>();

        for(Peer p: peers){
            Log.d("peer",p.name);
            peerNames.add(p);
        }

        ListView peersListView = findViewById(R.id.peer_list);
        peersAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, peers);
        peersListView.setAdapter(peersAdapter);
        peersAdapter.notifyDataSetChanged();
        peersListView.setOnItemClickListener(this);

    }

    private static List<Peer> getPeers(Intent intent) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            return intent.getParcelableArrayListExtra(PEERS_KEY, Peer.class);
        } else {
            return intent.getParcelableArrayListExtra(PEERS_KEY);
        }
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        /*
         * Clicking on a peer brings up details
         */
        Peer peer = peersAdapter.getItem(position);
        Intent intent = new Intent(this, ViewPeerActivity.class);
        intent.putExtra(ViewPeerActivity.PEER_KEY, peer);
        startActivity(intent);
    }
}
