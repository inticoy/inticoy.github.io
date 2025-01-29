export default function IconLogo() {
  return (
    <div>
      <img
        className="w-auto h-10 dark:hidden"
        src="/logo/inticoy.svg"
        alt="Logo"
      />
      <img
        className="w-auto h-10 hidden dark:block"
        src="/logo/inticoy-dark-mode.svg"
        alt="Logo"
      />
    </div>
  );
}
