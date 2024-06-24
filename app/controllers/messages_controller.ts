import type { HttpContext } from '@adonisjs/core/http'

const messages: string[] = []
const connections: Record<string, HttpContext['response'][]> = {}

export default class MessagesController {
  async sendMessages({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.status(400).json({ error: 'utilisateur non trouvé' })
    }
    const user = auth.user
    const userId = user.id

    response.response.setHeader('Content-Type', 'text/event-stream')
    response.response.setHeader('Cache-control', 'no-cache')
    response.response.setHeader('Connection', 'keep-alive')

    if (!connections[userId]) {
      connections[userId] = []
    }

    connections[userId].push(response)

    const sendData = () => response.response.write(`data: ${JSON.stringify(messages)}\n\n`)
    sendData()

    const interval = setInterval(sendData, 1000)

    response.response.on('close', () => {
      connections[userId] = connections[userId].filter((res) => res !== response)
      clearInterval(interval)
      response.response.end()
    })
  }

  async storeMessage({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.status(400).json({ error: 'utilisateur non trouvé' })
    }

    const sender = auth.user
    const recipientId = request.input('recipient_id')
    const message = request.input('message')

    const messageData = {
      sender_id: sender.id,
      recipient_id: recipientId,
      message: message,
      timestamp: new Date().toString(),
    }

    if (connections[recipientId]) {
      connections[recipientId].forEach((res) => {
        res.response.write(`data: ${JSON.stringify(messageData)}\n\n`)
      })
    }

    messages.push(messageData.message)

    return response.status(201).send(messageData)
  }
}
