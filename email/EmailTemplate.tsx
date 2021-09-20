import { EmailData } from '@/types/Email'

export function EmailTemplate({ subject, name, email, message }: EmailData) {
  return (
    <body>
      <section
        style={{
          backgroundColor: '#1a202c',
          color: '#ffffff',
          padding: '2rem',
        }}
      >
        <h1 style={{ textAlign: 'center', textTransform: 'capitalize', marginTop: 0 }}>
          {subject}
        </h1>
        <h3>
          Name: <span style={{ color: '#81e6d9' }}>{name}</span>
        </h3>
        <h3>
          Email:{' '}
          <a href={`mailto:${email}`} style={{ color: '#81e6d9' }}>
            {email}
          </a>
        </h3>

        <article
          style={{
            backgroundColor: '#308c7a4c',
            color: '#81e6d9',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}
        >
          <h3 style={{ margin: 0 }}>Message:</h3>
          <p style={{ margin: 0, fontSize: '1rem' }}>{message}</p>
        </article>
      </section>
    </body>
  )
}
