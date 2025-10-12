import { useQuery } from '@tanstack/react-query'

interface WelcomeMessage {
  message: string
  nextSteps: string[]
}

const fetchWelcomeMessage = async (): Promise<WelcomeMessage> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300)
  })

  return {
    message: 'The admin interface foundation is ready.',
    nextSteps: [
      'Connect to the api.etin.dev backend.',
      'Replace this placeholder dashboard with real widgets.',
      'Share TanStack Query hooks across upcoming routes.',
    ],
  }
}

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['welcome-message'],
    queryFn: fetchWelcomeMessage,
  })

  return (
    <section>
      <h1>Welcome to the admin dashboard</h1>
      {isLoading && <p>Preparing your workspace…</p>}
      {isError && <p>Something went wrong while loading the next steps.</p>}
      {data && (
        <>
          <p>{data.message}</p>
          <div>
            <h2 className="home__subheading">Suggested next steps</h2>
            <ul className="home__list">
              {data.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}

export default HomePage
