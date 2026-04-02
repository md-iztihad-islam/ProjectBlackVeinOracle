import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Lock,
  Eye,
  Network,
  AlertTriangle,
  ChevronRight,
  Skull,
  Scale,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Skull,
    title: "Criminal Registry",
    description: "Comprehensive criminal profiling with risk assessment and tracking across jurisdictions.",
  },
  {
    icon: Network,
    title: "Organization Mapping",
    description: "Visualize criminal networks, affiliations, and hierarchical relationships.",
  },
  {
    icon: Lock,
    title: "Incarceration Management",
    description: "Real-time jail occupancy, cell allocation, and custody status monitoring.",
  },
  {
    icon: Scale,
    title: "Case & Bail Tracking",
    description: "End-to-end case lifecycle management with integrated bail proceedings.",
  },
  {
    icon: Building2,
    title: "Thana Operations",
    description: "Unified police station management with officer assignments and GD reporting.",
  },
  {
    icon: Eye,
    title: "Surveillance Intel",
    description: "Location tracking and movement patterns for persons of interest.",
  },
];

const stats = [
  { value: "4", label: "Role Portals" },
  { value: "20+", label: "Secured API Modules" },
  { value: "30+", label: "Data Entities" },
  { value: "RBAC", label: "Permission Model" },
];

const documentation = [
  {
    title: "Role Portals",
    details: "Dedicated dashboards for Admin, Thana, Jail, and User operations with route-level access control.",
  },
  {
    title: "Operational Coverage",
    details: "Case files, arrests, incarceration, cell blocks, transfers, notifications, and analytics are integrated end-to-end.",
  },
  {
    title: "Technical Stack",
    details: "Frontend: React + Router + Query. Backend: Node.js + Express + PostgreSQL repository/service architecture.",
  },
  {
    title: "Audit & Security",
    details: "Authenticated workflows, role checks, and event visibility through role-specific notification and analytics modules.",
  },
];

function HomePage() {
  return (
    <div className="home-page-root min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Custom Styles for the 'Bleed' Effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow {
          text-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
        }
        .glow-crimson {
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
        }
        .glow-crimson:hover {
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
        }
      `}} />

      {/* Background grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              BV
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">BLACK VEIN</h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.3em]">ORACLE</p>
            </div>
          </div>
          <Link to="/access">
            <Button variant="outline" className="gap-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              Access System <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wide">SYSTEM ONLINE</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            <span className="text-foreground">When Database</span>
            <br />
            <span className="text-primary text-glow">Learns To Bleed</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A unified criminal intelligence platform for law enforcement. 
            Track, analyze, and neutralize threats with precision.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/access">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-crimson">
                <Shield size={18} />
                Enter Oracle
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-secondary" onClick={() => document.getElementById("project-docs")?.scrollIntoView({ behavior: "smooth" })}>
              <Database size={18} />
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Floating alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 mx-auto max-w-xl"
        >
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-500">Restricted Access</p>
              <p className="text-xs text-muted-foreground mt-1">
                This system is classified. Unauthorized access attempts are logged and prosecuted.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold font-mono text-primary lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-3">Capabilities</p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Precision Intelligence</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Integrated modules designed for comprehensive law enforcement operations.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Documentation */}
      <section id="project-docs" className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-xl border border-border bg-card/60 p-8 lg:p-10">
          <p className="text-xs font-mono uppercase tracking-[0.28em] text-primary mb-3">Project Documentation</p>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Black Vein Oracle Overview</h2>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            This project is a role-based criminal intelligence and custody platform built for coordinated operations
            between administrative, thana, jail, and citizen-facing workflows.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {documentation.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background/70 p-5">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center lg:p-12 glow-crimson"
        >
          <h2 className="text-2xl font-bold lg:text-3xl">Ready to Access the Oracle?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Authorized personnel only. All activities are monitored and recorded.
          </p>
          <Link to="/access" className="mt-8 inline-block">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10">
              <Lock size={18} />
              Secure Login
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 BLACK VEIN ORACLE. CLASSIFIED SYSTEM.
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              v1.0.0 — NODE: <span className="text-green-500 font-bold">ACTIVE</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;