
const onmessageEventMap = new Map()
const mainEventMap = new Map()

let MsgPort: MessagePort; // 绑定的node通信port

window.onmessage = (event) => { // preload 传递的事件
  const fn = onmessageEventMap.get(event.data)
  if (fn) {
    onmessageEventMap.get(event.data)(event)
  }
}

function onMsg(tag:string,event:(event:MessageEvent<any>)=>void) {  // 为onmessage添加事件
  onmessageEventMap.set(tag,event)
}

onMsg("node-port",(event)=>{
  // event.source === window 表示消息来自预加载脚本
  // 而不是来自 <iframe> 或其他来源
  if (event.source === window) {
    const [ port ] = event.ports
    MsgPort = port
    // 一旦我们有了这个端口，我们就可以直接与主进程通信
    MsgPort.onmessage = (portEvent) => {
      if (!(portEvent.data && portEvent.data.cmd)) {
        throw new Error("msg must has property 'cmd'");
      }
      if (typeof portEvent.data.cmd !== 'string' ) {
        throw new Error("'cmd' type must be string ");
      }
      const fn = mainEventMap.get(portEvent.data.cmd)
      if (fn) {
        const event = portEvent
        const cmd = event.data.cmd
        const data = event.data.data
        mainEventMap.get(cmd)(data,event)
      }
    }
  }
})

function onMainMsg(tag:string,event:(data:unknown,event:MessageEvent<any>)=>void) {
  mainEventMap.set(tag,event)
}

function sendMainMsg(msg:unknown){
  if (MsgPort) {
    MsgPort.postMessage(msg)
  }
}

onMainMsg("connected",(data,event)=>{
  console.log(data,event);
})

export default {
  onMsg,
  onMainMsg,
  sendMainMsg
}
