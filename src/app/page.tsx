"use client";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [copied, setCopied] = useState(false);
  const npxCommand = `npx create-unops-app@latest <my-unops-app>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(npxCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            View on GitHub
          </a>
          <a
            href={siteConfig.links.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Documentation
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">What&apos;s Inside</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 border border-border rounded-lg"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 py-12 border-t border-border">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Ready to Build?</h2>
          <p className="text-muted-foreground max-w-2xl">
            Start building your UN/UNOPS project with this clean,
            production-ready starter.
          </p>
          <div className="flex flex-row gap-3 justify-center">
            <code className="bg-muted rounded-md px-4 py-2 text-sm font-mono">
              {npxCommand}
            </code>
            <TooltipProvider>
              <Tooltip>
                <TooltipContent className="font-mono">
                  Copy npx command
                </TooltipContent>
                <TooltipTrigger asChild>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="p-4"
                    aria-label="Copy npx command to clipboard"
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Next.js 16+",
    description: "App Router with TypeScript for modern React development",
  },
  {
    title: "UN/UNOPS Theme",
    description: "Pre-configured with CSS variables and Tailwind tokens",
  },
  {
    title: "Global Layout",
    description: "Header, Container, and Footer components ready to use",
  },
  {
    title: "Clean Architecture",
    description: "Organized folder structure under /src for scalability",
  },
  {
    title: "shadcn CLI Compatible",
    description: "Install components from the registry with ease",
  },
  {
    title: "Vercel Ready",
    description: "Serverless-friendly with zero special configuration needed",
  },
];
