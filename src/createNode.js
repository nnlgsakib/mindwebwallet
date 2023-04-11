const Libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const Websockets = require('libp2p-websockets');
const KadDHT = require('libp2p-kad-dht');
const MPLEX = require('pull-mplex');
const SECIO = require('libp2p-secio');
const PeerId = require('peer-id');
const PeerInfo = require('peer-info');
const multiaddr = require('multiaddr');

const bootstrapers = ['/dnsaddr/bootstrap.libp2p.io'];

const createNode = async () => {
  const peerId = await PeerId.create({ keyType: 'ed25519' });
  const peerInfo = await PeerInfo.create(peerId);

  const listenAddrs = ['/ip4/0.0.0.0/tcp/0', '/ip4/0.0.0.0/tcp/0/ws'];
  listenAddrs.forEach(addr => peerInfo.multiaddrs.add(multiaddr(addr)));

  const node = await Libp2p.create({
    peerId,
    addresses: {
      listen: listenAddrs
    },
    modules: {
      transport: [TCP, Websockets],
      streamMuxer: [MPLEX],
      connEncryption: [SECIO],
      dht: KadDHT
    },
    config: {
      dht: {
        enabled: true,
        randomWalk: {
          enabled: true
        }
      }
    }
  });

  bootstrapers.forEach((ma) => {
    node.peerStore.addressBook.add(multiaddr(ma));
  });

  node.on('peer:discovery', (peer) => {
    console.log(`Discovered peer ${peer.id.toB58String()}`);
  });

  await node.start();

  console.log(`Node started with ID ${peerId.toB58String()} and listening on: `);
  node.multiaddrs.forEach((ma) => console.log(`${ma.toString()}/p2p/${peerId.toB58String()}`));

  return node;
};

module.exports = createNode;
