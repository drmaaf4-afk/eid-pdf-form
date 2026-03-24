export const metadata = {
  title: "EID PDF Form",
  description: "Generate PDF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
