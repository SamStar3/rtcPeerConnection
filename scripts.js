
const socket = io.connect('https://localhost:8181/');


const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');

let localStream;
let remoteStream;
let peerConnection;

let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

const call = async e=>{
    await fetchUserMedia();

    //peerConnection is all set with our STUN servers sent over
    await createPeerConnection();

    //create offer time!
    try{
        console.log("Creating offer...")
        const offer = await peerConnection.createOffer();
        console.log(offer);
        peerConnection.setLocalDescription(offer);
        didIOffer = true;
        socket.emit('newOffer',offer); //send offer to signalingServer
    }catch(err){
        console.log(err)
    }

}

const createPeerConnection =  () => {

    return new Promise(async(resolve,reject)=> {
        peerConnection = await new RTCPeerConnection(peerConfiguration);

        localStream.getTracks().forEach(track=> {
            peerConnection.addTrack(track,localStream);
        })

        peerConnection.addEventListener('icecandidate', e=>{
            console.log('....... Ice candidate found!.......');
            console.log(e)
        } )
        resolve();
    })

}



document.querySelector('#call').addEventListener('click',call)