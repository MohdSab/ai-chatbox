'use client'
import { useState, useEffect, useRef } from "react"
import { Box, Button, Stack, TextField, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import { color, motion } from 'framer-motion'
import Image from "next/image"
import photo from './pfp.png'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello!! I am your football (soccer) expert assistant. How can I help you today?"
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const isMobile = useMediaQuery('(max-width: 500px')

  const sendMessage = async () => {
    if (!message.trim()) return;  
    
    setIsLoading(true)
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    setIsTyping(true)
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Stack
        direction="column"
        width={isMobile ? '100vw' : '500px'}
        height="100vh"
        sx={{
          backgroundColor: 'white',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: 8,
          padding: 2,
          spacing: 3,
        }}
      >
        <Stack 
        direction={'column'}
        >
          <Box 
          width="100%" 
          height="100%"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={1}
          >
            <Image 
              src={photo} 
              alt="Profile Picture" 
              width={50} 
              height={50} 
              objectFit="cover"
              style={{ borderRadius: '50%' }}
            />
          </Box>
          <Typography variant="h6" align="center">
            Soccerates
          </Typography>
          <Typography variant="subtitle" align="center" gutterBottom>
            The Soccer Expert AI
          </Typography>
        </Stack>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: message.role === 'assistant' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? '#d8d8d8' // Primary color
                      : '#218aff' // Secondary color
                  }
                  color={
                    message.role === 'assistant'
                      ? 'black'
                      : 'white'
                  }
                  borderRadius={8}
                  p={2.5}
                  maxWidth="80%"
                  boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
                >
                  {message.content}
                </Box>
              </Box>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              style={{ display: 'flex', justifyContent: 'flex-start', padding: '8px' }}
            >
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} />
                <Box ml={2} color="grey.500">Assistant is typing...</Box>
              </Box>
            </motion.div>
          )}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
