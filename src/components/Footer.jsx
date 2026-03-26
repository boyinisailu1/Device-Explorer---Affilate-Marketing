export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto py-8 text-center text-sm text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} DevX – Device Explorer. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-70 font-semibold tracking-wide uppercase">Compare smarter. Choose faster.</p>
      </div>
    </footer>
  );
}
