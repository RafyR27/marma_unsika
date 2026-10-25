import Link from "next/link";
import { Button } from "../ui/button";
import { Search, ShoppingCart } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Separator } from "../ui/separator";

const MainNavbar = () => {
  return (
    <nav className="w-full lg:h-20 h-18 bg-background lg:px-20 px-5 flex justify-between items-center gap-2">
      <div className="items-center gap-2 hidden md:block">
        <Link
          href={"/"}
          className="text-primary font-heading font-bold text-[1.2rem]"
        >
          Marma
        </Link>
      </div>

      <InputGroup className="lg:max-w-3xl max-w-lg">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari di marma..." />
        <InputGroupAddon align="inline-end">
          <button className="cursor-pointer px-2 hover:text-muted-foreground/70">
            Cari
          </button>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex gap-4">
        <Button variant="outline" className={"h-10 lg:h-8"}>
          <Link href={"/user/cart"} className="flex gap-2 px-2">
            <ShoppingCart />
            <p className="hidden md:block">Cart</p>
          </Link>
        </Button>

        <Separator
          orientation="vertical"
          className={"border hidden lg:block"}
        />

        <div className="space-x-2 hidden lg:block">
          <Button variant="outline">
            <Link href={"/auth/login"} className="flex gap-2 px-2">
              <p className="hidden md:block">Masuk</p>
            </Link>
          </Button>
          <Button variant="default">
            <Link href={"/auth/register"} className="flex gap-2 px-2">
              <p className="hidden md:block">Daftar</p>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export { MainNavbar };
