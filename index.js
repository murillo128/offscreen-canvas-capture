
document.body.onload = async ()=> {
// Offscreen version
var canvas = document.getElementById ("workerRenderCanvas");

canvas.width = canvas.clientWidth = 640
canvas.height = canvas.clientHeight = 480;

var offscreen = canvas.transferControlToOffscreen ();

var worker = new Worker ("worker.js");
worker.postMessage ({canvas: offscreen}, [offscreen]);
worker.postMessage ({width: 640, height: 480});

//Create pcs
const sender	= window.sender   = new RTCPeerConnection();
const receiver	= window.receiver = new RTCPeerConnection();

receiver.ontrack = ({track}) => {
	mirror.srcObject = new MediaStream([track]);
	mirror.onclick = ()=>mirror.play();
	mirror.play();
}
//Interchange candidates
sender.onicecandidate	= ({candidate}) => candidate && receiver.addIceCandidate(candidate);
receiver.onicecandidate = ({candidate}) => candidate && sender.addIceCandidate(candidate);

sender.addTrack(canvas.captureStream().getTracks()[0]);

const offer = await sender.createOffer();
offer.sdp = offer.sdp.replace("useinbandfec=1", "useinbandfec=0; dtx=0; stereo=1; ptime=10; maxptime=10;")
await sender.setLocalDescription(offer);
await receiver.setRemoteDescription(offer);

const answer = await receiver.createAnswer();
answer.sdp = answer.sdp.replace("useinbandfec=1", "useinbandfec=0; dtx=0; stereo=1; ptime=10; maxptime=10;")
await receiver.setLocalDescription(answer);
await sender.setRemoteDescription(answer);
}



