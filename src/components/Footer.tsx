export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Hau Developer. All rights reserved.</p>
      </div>
    </footer>
  );
}
