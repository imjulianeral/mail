import { useCallback } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Box, Center, Heading, VStack } from '@chakra-ui/layout'
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Textarea } from '@chakra-ui/textarea'
import { Button } from '@chakra-ui/button'
import { useToast } from '@chakra-ui/toast'
import { EmailIcon } from '@chakra-ui/icons'
import { SubmitHandler, useForm } from 'react-hook-form'

import type { EmailData } from '@/types/Email'
import { EmailTemplate } from '@/email/EmailTemplate'
import { Email } from '@/email/smtp'

export function SendMailForm() {
  const toast = useToast()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailData>({ mode: 'onBlur' })

  const sendMail: SubmitHandler<EmailData> = useCallback(
    async data => {
      try {
        await Email.send({
          SecureToken: process.env.NEXT_PUBLIC_EMAIL_TOKEN,
          To: data.email,
          From: process.env.NEXT_PUBLIC_EMAIL,
          Subject: data.subject,
          Body: renderToStaticMarkup(<EmailTemplate {...data} />),
        })

        toast({
          title: 'Mail successfully sent',
          description: `The mail was sent to: ${data.email}`,
          status: 'success',
          position: 'top',
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        console.error(error)
      } finally {
        reset()
      }
    },
    [reset, toast]
  )

  return (
    <Center h="100vh">
      <VStack spacing={7} align="stretch">
        <Heading as="h1" alignSelf="center">
          Send mail with SMTP.js
        </Heading>
        <Box maxW="lg" p="5" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <form onSubmit={handleSubmit(sendMail)}>
            <VStack spacing={7} align="stretch">
              <FormControl isInvalid={errors.subject as boolean | undefined}>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  {...register('subject', {
                    required: 'The subject is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                />
                <FormErrorMessage>{errors.subject?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.name as boolean | undefined}>
                <Input
                  type="text"
                  id="name"
                  placeholder="Name"
                  {...register('name', {
                    required: 'The name is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.email as boolean | undefined}>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register('email', {
                    required: 'The email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Write a valid email' },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.message as boolean | undefined}>
                <Textarea
                  id="message"
                  placeholder="Write your message"
                  {...register('message', {
                    required: 'The message is required',
                    minLength: { value: 10, message: 'Minimum length should be 10' },
                  })}
                />
                <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="md"
                loadingText="Submitting"
                isFullWidth={true}
                isLoading={isSubmitting}
                leftIcon={<EmailIcon />}
              >
                Send
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Center>
  )
}
