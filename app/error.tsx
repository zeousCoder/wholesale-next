"use client";

  export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-red-500">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/80"
        >
          Try again
        </button>
      </main>
    );
  }
  