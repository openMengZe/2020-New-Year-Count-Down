const color_options = ["#0074D9", "#FF4136", "#F012BE", "#2ECC40"];
const color = color_options[getRandom(0, color_options.length)];

class ChatBoxController extends Doloro {
  constructor () {
    super()

    this.newMsgBox({
      from: 'doloro web client',
      message: 'connecting to an available doloro server...',
    })

    var that = this
    document.getElementById('send-message-input').onkeydown = function (e) {
      switch (e.key) {
        case 'Enter':
          that.sendMsg(e.target.value, 'txt', document.getElementById('username-input').value)
          e.target.value = ''
          break
      }
    }
    document.getElementById('send-message-button').onclick = function () {
      that.sendMsg(document.getElementById('send-message-input').value, 'txt', document.getElementById('username-input').value)
      document.getElementById('send-message-input').value = ''
    }

    this.messagesDisplayedCount = 0
  }

  newMsgBox (params) {
    if (!params.from) {
      params.from =  + "someone said"
    }
    document.getElementById('chat-messages-container').innerHTML = document.getElementById('chat-messages-container').innerHTML +
    ` <p>
        <strong style="color: ${color};">${params.from}</strong>: ${params.message}
      </p>`
    this.messagesDisplayedCount++
  }

  eventCb (response) {
    if (response.event == "complete_handshake") {
      this.newMsgBox({
        from: 'doloro web client',
        message: 'connected to a server!'
      })
      document.getElementById('send-message-input').disabled = false
      document.getElementById('send-message-button').disabled = false
      document.getElementById('send-message-button').classList.remove('is-loading')
    } else if (response.event == "new_message") {
      this.newMsgBox({
        from: response.params.from,
        message: response.params.content
      })
    } else if (response.event == "lost_connection") {
      document.getElementById('send-message-input').disabled = true
      document.getElementById('send-message-button').classList.add('is-loading')
      document.getElementById('send-message-button').disabled = true
    } else {
      console.warn('Unprogrammed response: ' + JSON.stringify(response))
    }
  }
}

var controller = new ChatBoxController()
