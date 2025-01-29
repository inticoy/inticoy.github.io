import IconLogo from "./IconLogo";
import TextLogo from "./TextLogo";

export default function Logo() {
  return (
    <div
      className="flex flex-row items-center cursor-pointer"
      onClick={() => (location.href = "/")}
    >
      <IconLogo />
      <TextLogo />
    </div>
  );
}
