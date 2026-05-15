import { createElement, type HTMLAttributes } from "react";

type IconProps = HTMLAttributes<HTMLSpanElement>;

function createIcon(glyph: string) {
  function Icon({ className = "", ...props }: IconProps) {
    return createElement(
      "span",
      {
        "aria-hidden": "true",
        className: `inline-flex items-center justify-center ${className}`.trim(),
        ...props
      },
      glyph
    );
  }

  return Icon;
}

export const FaArrowRight = createIcon("→");
export const FaFacebookF = createIcon("f");
export const FaInstagram = createIcon("◉");
export const FaLeaf = createIcon("❧");
export const FaLinkedinIn = createIcon("in");
export const FaShieldAlt = createIcon("⛨");
export const FaMagic = createIcon("✦");
export const FaStar = createIcon("★");
export const FaTwitter = createIcon("𝕏");
export const FaShoppingBag = createIcon("👜");
export const FaShoppingCart = createIcon("🛒");
export const FaInfoCircle = createIcon("ⓘ");
export const FaUserCircle = createIcon("👤");
export const FaEnvelope = createIcon("✉");
export const FaHome = createIcon("⌂");
export const FaNewspaper = createIcon("📰");
export const FaSignOutAlt = createIcon("⇥");
export const FaSignInAlt = createIcon("⇤");
export const FaUserPlus = createIcon("⊕");
export const FaMapMarkerAlt = createIcon("⌖");
export const FaPhone = createIcon("☎");
export const FaQuestionCircle = createIcon("?");
export const FaLifeRing = createIcon("◌");
export const FaComments = createIcon("💬");
export const FaTruck = createIcon("🚚");
