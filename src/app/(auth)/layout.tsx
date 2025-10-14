import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication | E-Commerce Web",
    description:
        "Login or create an account to access your e-commerce platform",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
