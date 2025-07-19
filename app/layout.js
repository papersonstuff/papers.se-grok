import './globals.css';  // If you have global CSS - optional for now

export const metadata = {
  title: 'Papers.se - AI News Aggregator',
  description: 'Your AI news aggregator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
