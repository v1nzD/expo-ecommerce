import React from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const App = () => {
  return (
    <div>
      <h1>Home Page</h1>

      {/* Show the sign-in and sign-up buttons when the user is signed out */}
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default App;
