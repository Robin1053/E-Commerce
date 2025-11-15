import * as React from "react";
import ShopOutlinedIcon from '@mui/icons-material/ShopOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Branding, type Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Shop',
  },
  {
    segment: 'page',
    title: 'Products',
    icon: React.createElement(ShopOutlinedIcon),
  },
  {
    segment: 'page-2',
    title: 'Your Orders',
    icon: React.createElement(ShoppingCartOutlinedIcon),
  },
];

const BRANDING: Branding = {
  title: "Dekorify",
  homeUrl: "/",
  logo: React.createElement("img", { src: "/Logo.png", alt: "Dekorify logo" }),
  
};

export { NAVIGATION, BRANDING };