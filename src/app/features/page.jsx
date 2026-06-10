"use client";

import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { motion } from "framer-motion";
import {
	Rocket,
	Send,
	Search,
	FileCheck,
	BarChart3,
	GraduationCap,
	CheckCircle2,
	Phone,
	Mail,
} from "lucide-react";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-50px" },
	transition: { duration: 0.6, ease: "easeOut" },
};

function OfferingCard({ number, Icon, title, description, features, highlight, children }) {
	return (
		<motion.div
			className="phase-card flex flex-col gap-6"
			initial={fadeUp.initial}
			whileInView={fadeUp.whileInView}
			viewport={fadeUp.viewport}
			transition={fadeUp.transition}
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#a855f7] text-white shadow-lg shadow-[#3b82f6]/40">
						<Icon className="h-7 w-7" />
					</div>
					<div>
						<p className="text-xs uppercase tracking-[0.25em] text-white/60">
							Offering {number}
						</p>
						<h2 className="mt-1 text-xl md:text-2xl font-semibold text-white">
							{title}
						</h2>
					</div>
				</div>
				<span className="inline-flex w-fit rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/60">
					Outmail Offering
				</span>
			</div>

			<p className="text-sm md:text-base text-white/70 max-w-3xl">
				{description}
			</p>

			<ul className="mt-3 space-y-2 text-sm md:text-base">
				{features.map((feature) => (
					<li key={feature} className="flex items-start gap-2 text-white/80">
						<CheckCircle2 className="mt-[2px] h-4 w-4 text-[#22c55e]" />
						<span>{feature}</span>
					</li>
				))}
			</ul>

			<div className="note-box mt-4 text-sm md:text-base text-white/90">
				{highlight}
			</div>

			{children && <div className="mt-5">{children}</div>}
		</motion.div>
	);
}

function RecruiterOutreachDemo() {
	return (
		<motion.div
			className="glass-card p-4 md:p-5"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<Send className="h-4 w-4 text-[#60a5fa]" />
					<span>Recruiter Outreach Demo</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Auto-simulated Gmail-style outreach</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="rounded-lg border border-white/10 bg-black/40 p-3">
					<p className="text-[11px] text-white/60 mb-1">Student searches</p>
					<div className="space-y-1.5">
						<p className="rounded-md bg-red-500/10 px-2 py-1 text-red-100/90">
							"startup companies hiring"
						</p>
						<p className="rounded-md bg-red-500/5 px-2 py-1 text-red-100/80">
							"companies hiring software engineers"
						</p>
						<p className="rounded-md bg-red-500/5 px-2 py-1 text-red-100/70">
							"recruiter email HR manager"
						</p>
					</div>
					<p className="mt-2 text-[11px] text-red-200">
						Only a few companies contacted. No targeting. No signals.
					</p>
				</div>
				<motion.div
					className="rounded-lg border border-blue-400/40 bg-blue-500/10 p-3"
					animate={{
						scale: [1, 1.02, 1],
						boxShadow: [
							"0 0 0px rgba(37,99,235,0.6)",
							"0 0 25px rgba(37,99,235,0.5)",
							"0 0 0px rgba(37,99,235,0.6)",
						],
					}}
					transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
				>
					<p className="text-[11px] font-medium text-blue-100 mb-1 flex items-center gap-2">
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30">
							<Send className="h-3 w-3" />
						</span>
						Smart campaigns. Real signals.
					</p>
					<p className="text-[11px] text-white/80">
						Outmail builds a targeted list of companies like Razorpay, Zerodha, CRED, and Postman—and sends personalized emails on behalf of students.
					</p>
				</motion.div>
			</div>
		</motion.div>
	);
}

function OpportunityDiscoveryDemo() {
	return (
		<motion.div
			className="glass-card p-4 md:p-5"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<Search className="h-4 w-4 text-[#60a5fa]" />
					<span>Job Discovery Feed</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Curated & ranked opportunities</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="flex flex-wrap gap-2">
					{["Backend", "Entry Level", "Bangalore"].map((chip) => (
						<span
							key={chip}
							className="rounded-full bg-blue-500/15 border border-blue-400/60 px-3 py-1 text-[11px] text-blue-100"
						>
							{chip}
						</span>
					))}
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					{[
						{ title: "Software Engineer — Backend", score: 94 },
						{ title: "Data Analyst — Entry Level", score: 88 },
						{ title: "Product Associate", score: 82 },
						{ title: "Frontend Developer", score: 79 },
					].map((job) => (
						<motion.div
							key={job.title}
							className="rounded-xl border border-white/10 bg-black/40 p-3 flex flex-col gap-1"
							whileHover={{ y: -3, scale: 1.01 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<p className="text-white/90 text-xs md:text-sm">{job.title}</p>
							<p className="text-white/60 text-[11px]">High-intent opportunity</p>
							<span className="mt-1 inline-flex w-max items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200">
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
								Outmail Score: {job.score}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

function AutoApplyDemo() {
	const fields = [
		"Full Name",
		"Email",
		"Phone",
		"Resume",
		"LinkedIn",
		"Education",
		"Skills",
	];

	return (
		<motion.div
			className="glass-card p-4 md:p-5"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<FileCheck className="h-4 w-4 text-[#60a5fa]" />
					<span>Auto Apply Magic</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Form auto-fill preview</span>
			</div>
			<div className="mt-4 space-y-2 text-xs md:text-sm">
				{fields.map((field, idx) => (
					<motion.div
						key={field}
						className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2"
						initial={{ opacity: 0, x: 10 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ delay: idx * 0.06, duration: 0.2 }}
					>
						<span className="text-white/70">{field}</span>
						<span className="flex items-center gap-1 text-[11px] text-emerald-200">
							<CheckCircle2 className="h-3 w-3" />
							auto-filled
						</span>
					</motion.div>
				))}
				<p className="mt-2 text-[11px] text-white/60">
					Enter once on the Outmail dashboard, apply everywhere faster.
				</p>
			</div>
		</motion.div>
	);
}

function PlacementAnalyticsDemo() {
	return (
		<motion.div
			className="glass-card p-4 md:p-5"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<BarChart3 className="h-4 w-4 text-[#60a5fa]" />
					<span>TPO Dashboard Snapshot</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Off-campus visibility</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="grid gap-3 md:grid-cols-2">
					{[
						{ label: "Students Onboarded", value: "1,247", hint: "+89 this week" },
						{ label: "Companies Contacted", value: "3,560", hint: "+340 this month" },
						{ label: "Applications Submitted", value: "8,920", hint: "+1.2k this month" },
						{ label: "Opportunities Discovered", value: "12,400", hint: "Updated daily" },
					].map((metric) => (
						<div
							key={metric.label}
							className="rounded-xl border border-white/10 bg-black/40 p-3"
						>
							<p className="text-[11px] text-white/60">{metric.label}</p>
							<p className="text-sm font-semibold text-white">{metric.value}</p>
							<p className="text-[11px] text-emerald-300">{metric.hint}</p>
						</div>
					))}
				</div>
				<div className="rounded-xl border border-blue-400/40 bg-blue-500/10 p-3">
					<p className="text-[11px] text-blue-100 mb-2">Weekly activity trend</p>
					<div className="mt-1 flex items-end gap-1 h-20">
						{[35, 42, 55, 48, 62, 70, 85].map((h, idx) => (
							<div key={idx} className="flex-1 rounded-full bg-white/10 overflow-hidden">
								<div
									className="w-full rounded-full bg-gradient-to-t from-[#3b82f6] to-[#a855f7]"
									style={{ height: `${h}%` }}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function MentorshipDemo() {
	return (
		<motion.div
			className="glass-card p-4 md:p-5"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<GraduationCap className="h-4 w-4 text-[#60a5fa]" />
					<span>Mentorship Sessions</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Structured guidance</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="rounded-lg border border-white/10 bg-black/40 p-3 space-y-1.5">
					{["how to prepare for product roles", "data science interview tips reddit", "best resume for freshers 2026", "software engineer career path quora"].map((query) => (
						<p
							key={query}
							className="rounded-md bg-red-500/5 px-2 py-1 text-[11px] text-red-100/80"
						>
							{query}
						</p>
					))}
					<p className="mt-1 text-[11px] text-red-200">
						Scattered, unreliable advice without structure.
					</p>
				</div>
				<div className="rounded-lg border border-purple-400/40 bg-purple-500/10 p-3 space-y-2">
					{["Resume Review Workshop · Priya M. — Google", "Hiring Trends Discussion · Amit K. — Razorpay", "Mock Interview Session · Sara J. — Microsoft"].map((session) => (
						<motion.div
							key={session}
							className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2"
							whileHover={{ y: -2 }}
						>
							<span className="text-[11px] text-white/80">{session}</span>
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

function BookCallModal({ open, onClose }) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
			<motion.div
				className="glass-card max-w-md w-full relative"
				initial={{ opacity: 0, scale: 0.9, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.9, y: 20 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-white/60 hover:text-white text-sm"
				>
					✕
				</button>
				<div className="p-6 md:p-8 space-y-4">
					<div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#a855f7] text-white shadow-lg">
						<Phone className="h-5 w-5" />
					</div>
					<h3 className="text-xl md:text-2xl font-semibold text-white">
						Book a Call
					</h3>
					<p className="text-sm md:text-base text-white/70">
						Want to understand how Outmail can support your students&apos; off-campus placements? Send us an email and we&apos;ll get back to you with available slots.
					</p>
					<p className="text-sm text-white/80">
						Write to
						<a
							href="mailto:contact@outmail.in"
							className="ml-1 font-medium text-[#a855f7] underline-offset-2 hover:underline"
						>
							contact@outmail.in
						</a>
            
					</p>
					<a
						href="mailto:contact@outmail.in"
						className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-[#3b82f6]/40"
					>
						<Mail className="mr-2 h-4 w-4" />
						Send Email
					</a>
				</div>
			</motion.div>
		</div>
	);
}

function Page() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="min-h-screen bg-[#050816] text-white">
			<Navbar variant="dark" />

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-32 pb-20 px-6 lg:px-8">
				<div className="absolute inset-0 pointer-events-none">
					<div className="hero-glow" />
				</div>

				{/* Floating shapes (mirroring partnership page) */}
				<motion.div
					animate={{ y: [0, -18, 0] }}
					transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-[#6c00ff]/20 rotate-12 blur-[1px]"
				/>
				<motion.div
					animate={{ y: [0, 16, 0] }}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-[#ad46ff]/20"
				/>
				<motion.div
					animate={{ y: [0, -14, 0] }}
					transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-8 left-[20%] w-24 h-24 rounded-lg border border-white/10 bg-[#2f1a7a]/40 -rotate-12"
				/>

				<div className="relative max-w-4xl mx-auto text-center">
					<motion.div
						initial={fadeUp.initial}
						whileInView={fadeUp.whileInView}
						viewport={fadeUp.viewport}
						transition={{ ...fadeUp.transition, delay: 0 }}
						className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/40 bg-[#0b1120]/80 px-4 py-1.5 text-xs text-white/80 mb-4"
					>
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
							<Rocket className="h-3 w-3 text-blue-300" />
						</span>
						<span className="uppercase tracking-[0.25em]">Core Offerings</span>
					</motion.div>

					<motion.h1
						initial={fadeUp.initial}
						whileInView={fadeUp.whileInView}
						viewport={fadeUp.viewport}
						transition={{ ...fadeUp.transition, delay: 0.1 }}
						className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
					>
						What
						{" "}
						<span className="font-satisfy bg-gradient-to-r from-[#b06cff] via-white to-[#b06cff] bg-clip-text text-transparent">
							Outmail
						</span>{" "}
						Does
						<br className="hidden sm:block" /> for Students
					</motion.h1>

					<motion.p
						initial={fadeUp.initial}
						whileInView={fadeUp.whileInView}
						viewport={fadeUp.viewport}
						transition={{ ...fadeUp.transition, delay: 0.2 }}
						className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl mx-auto"
					>
						Outmail combines recruiter outreach, intelligent opportunity discovery, automated applications,
						placement analytics, and industry mentorship to improve off-campus placement outcomes
						for university students.
					</motion.p>

					<motion.div
						initial={fadeUp.initial}
						whileInView={fadeUp.whileInView}
						viewport={fadeUp.viewport}
						transition={{ ...fadeUp.transition, delay: 0.3 }}
						className="mt-8 flex flex-wrap items-center justify-center gap-4"
					>
						<button
							onClick={() => setIsModalOpen(true)}
							className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-6 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#3b82f6]/40"
						>
							<Phone className="mr-2 h-4 w-4" />
							Book a Call
						</button>
						<a
							href="mailto:contact@outmail.in"
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm sm:text-base font-medium text-white/80 hover:bg-white/10"
						>
							<Mail className="mr-2 h-4 w-4" />
							Contact Us
						</a>
					</motion.div>
				</div>
			</section>

			{/* Offerings */}
			<section className="relative z-10 px-6 pb-16 lg:px-8">
				<div className="max-w-5xl mx-auto space-y-12">
					<OfferingCard
						number={1}
						Icon={Send}
						title="Structured Recruiter Outreach"
						description="Outmail runs personalized cold email outreach campaigns to recruiters on behalf of students, targeting companies that show strong hiring signals such as funding activity, hiring momentum, and industry growth."
						features={[
							"Personalized outreach campaigns sent on behalf of students",
							"Targets companies with strong hiring signals — funding, growth, momentum",
							"Higher probability of getting noticed and hired",
							"Safe sending limits and compliance-first approach",
						]}
						highlight="Students reach companies where their probability of getting noticed and hired is significantly higher."
					>
						<RecruiterOutreachDemo />
					</OfferingCard>

					<OfferingCard
						number={2}
						Icon={Search}
						title="Intelligent Opportunity Discovery"
						description="Students receive a curated list of job opportunities filtered by role, industry, and hiring activity. Each opportunity is ranked using an Outmail Score for smarter prioritization."
						features={[
							"Chances of the student getting shortlisted",
							"Company hiring activity and momentum",
							"Company reputation and work environment",
							"Role and industry-based intelligent filtering",
						]}
						highlight="The Outmail Score helps students prioritize high-probability and high-quality opportunities."
					>
						<OpportunityDiscoveryDemo />
					</OfferingCard>

					<OfferingCard
						number={3}
						Icon={FileCheck}
						title="Automated Job Applications"
						description="Students enter their profile details once on the Outmail dashboard. When they choose to apply for a job, Outmail automatically fills most of the application fields on their behalf."
						features={[
							"One-time profile setup on the Outmail dashboard",
							"Auto-fill application fields for faster submissions",
							"Apply to multiple opportunities at scale",
							"Eliminates repetitive form filling entirely",
						]}
						highlight="Students can apply faster and at scale, focusing their energy on preparation instead of paperwork."
					>
						<AutoApplyDemo />
					</OfferingCard>

					<OfferingCard
						number={4}
						Icon={BarChart3}
						title="Placement Visibility & Analytics for Universities"
						description="Outmail provides placement dashboards for TPOs and placement cells, offering visibility into students' off-campus placement activity."
						features={[
							"Recruiter outreach executed and tracked",
							"Companies contacted by students",
							"Job applications submitted",
							"Opportunities discovered and engagement levels",
							"Institutional-level reporting and insights",
						]}
						highlight="Universities can track and understand off-campus placement outcomes with complete transparency."
					>
						<PlacementAnalyticsDemo />
					</OfferingCard>

					<OfferingCard
						number={5}
						Icon={GraduationCap}
						title="Industry Mentorship & Career Guidance"
						description="Outmail connects students with working professionals across tech, non-tech, and core roles through structured mentorship programs."
						features={[
							"Live mentorship sessions with industry professionals",
							"Resume reviews and profile building workshops",
							"Hiring trend discussions and market insights",
							"Group Q&A sessions for targeted preparation",
						]}
						highlight="Students prepare effectively for the roles and companies they are targeting with guidance from those who&apos;ve been there."
					>
						<MentorshipDemo />
					</OfferingCard>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-6 pb-20 lg:px-8">
				<div className="max-w-3xl mx-auto text-center space-y-5">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
						Bring Structured Placement Support to Your Students
					</h2>
					<p className="text-sm sm:text-base text-white/70">
						Empower your placement cell with outreach, discovery, automation, analytics, and mentorship — all in one platform.
					</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4">
						<button
							onClick={() => setIsModalOpen(true)}
							className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-6 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#3b82f6]/40"
						>
							<Phone className="mr-2 h-4 w-4" />
							Book a Call
						</button>
						<a
							href="mailto:contact@outmail.in"
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm sm:text-base font-medium text-white/80 hover:bg-white/10"
						>
							<Mail className="mr-2 h-4 w-4" />
							Contact Us
						</a>
					</div>
				</div>
			</section>

			<Footer variant="dark" />

			<BookCallModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	);
}

export default Page;
