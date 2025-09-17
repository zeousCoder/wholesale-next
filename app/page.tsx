

  export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to <span className="text-primary">wholesale-next</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your Next.js project is set up and ready to go!
          </p>
          <div className="mt-6">
            <button>Get Started</button>
          </div>
        </div>
      </main>
    );
  }
  