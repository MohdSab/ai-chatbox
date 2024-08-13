'use client'
import { useState, useEffect, useRef } from "react"
import { Box, Button, Stack, TextField } from '@mui/material'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello!! I am your football (soccer) expert assistant. How can I help you today?"
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
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
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 'use client'
// import { useState, useEffect, useRef } from "react"
// import { Box, Button, Stack, TextField, CircularProgress, Avatar } from '@mui/material'
// import SendIcon from '@mui/icons-material/Send'

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: "Hello!! I am your football (soccer) expert assistant. How can I help you today?"
//     },
//   ])
//   const [message, setMessage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)

//   const sendMessage = async () => {
//     if (!message.trim()) return;  // Don't send empty messages
  
//     // Update the message state to show the user's message
//     const newMessages = [
//       ...messages,
//       { role: 'user', content: message },
//     ]
//     setMessages(newMessages)
//     setMessage('')  // Clear the input field
//     setIsTyping(true)  // Show typing indicator
  
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newMessages),
//       })
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok')
//       }
  
//       const reader = response.body.getReader()
//       const decoder = new TextDecoder()
  
//       let assistantMessage = ''
//       while (true) {
//         const { done, value } = await reader.read()
//         if (done) break
//         const text = decoder.decode(value, { stream: true })
//         assistantMessage += text
//         setMessages((prevMessages) => [
//           ...prevMessages.slice(0, prevMessages.length - 1),
//           { role: 'assistant', content: assistantMessage },
//         ])
//       }
//     } catch (error) {
//       console.error('Error:', error)
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
//       ])
//     } finally {
//       setIsTyping(false)  // Hide typing indicator
//     }
//   }

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault()
//       sendMessage()
//     }
//   }

//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//       alignItems="center"
//       bgcolor="#f0f2f5"
//     >
//       <Stack
//         direction={'column'}
//         width="100%"
//         maxWidth="500px"
//         height="100%"
//         maxHeight="700px"
//         bgcolor="white"
//         borderRadius={8}
//         boxShadow={3}
//         p={2}
//         spacing={3}
//       >
//         <Stack
//           direction={'column'}
//           spacing={2}
//           flexGrow={1}
//           overflow="auto"
//           maxHeight="100%"
//         >
//           {messages.map((message, index) => (
//             <Box
//               key={index}
//               display="flex"
//               alignItems="center"
//               justifyContent={
//                 message.role === 'assistant' ? 'flex-start' : 'flex-end'
//               }
//             >
//               {message.role === 'assistant' && (
//                 <Avatar sx={{ bgcolor: 'primary.main', marginRight: 1 }}>A</Avatar>
//               )}
//               <Box
//                 position="relative"
//                 maxWidth="80%"
//                 bgcolor={
//                   message.role === 'assistant'
//                     ? 'primary.main'
//                     : 'secondary.main'
//                 }
//                 color="white"
//                 borderRadius={2}
//                 p={2}
//                 sx={{
//                   '&::after': {
//                     content: '""',
//                     position: 'absolute',
//                     top: '50%',
//                     left: message.role === 'assistant' ? '-10px' : 'auto',
//                     right: message.role === 'user' ? '-10px' : 'auto',
//                     transform: 'translateY(-50%)',
//                     borderWidth: '10px',
//                     borderStyle: 'solid',
//                     borderColor: message.role === 'assistant' 
//                       ? 'transparent transparent transparent #1976d2' 
//                       : 'transparent #dc004e transparent transparent',
//                   }
//                 }}
//               >
//                 {message.content}
//               </Box>
//               {message.role === 'user' && (
//                 <Avatar sx={{ bgcolor: 'secondary.main', marginLeft: 1 }}>U</Avatar>
//               )}
//             </Box>
//           ))}
//           {isTyping && (
//             <Box display="flex" alignItems="center" justifyContent="flex-start">
//               <Avatar sx={{ bgcolor: 'primary.main', marginRight: 1 }}>A</Avatar>
//               <Box
//                 maxWidth="80%"
//                 bgcolor="primary.main"
//                 color="white"
//                 borderRadius={2}
//                 p={2}
//               >
//                 <CircularProgress size={20} color="inherit" />
//               </Box>
//             </Box>
//           )}
//           <div ref={messagesEndRef} />
//         </Stack>
//         <Stack direction={'row'} spacing={2}>
//           <TextField
//             label="Type your message..."
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={isLoading}
//             variant="outlined"
//           />
//           <Button 
//             variant="contained" 
//             onClick={sendMessage}
//             disabled={isLoading}
//             endIcon={<SendIcon />}
//           >
//             Send
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   )
// }
