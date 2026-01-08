"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I become a member?",
    answer:
      "Simply click the 'Become a Member' button, select your plan, and complete the registration form. You'll have immediate access to all member benefits upon successful payment.",
  },
  {
    question: "Can I upgrade my membership later?",
    answer:
      "Yes! You can upgrade your membership at any time. When you upgrade, you'll receive a prorated credit for your current plan toward the new plan.",
  },
  {
    question: "Are CME credits included in the membership?",
    answer:
      "Yes, our Professional and Institution plans include access to all CME-accredited courses. You can earn up to 100+ CME credits annually through our programs.",
  },
  {
    question: "Do you offer group discounts for institutions?",
    answer:
      "Our Institution plan includes up to 25 team members. For larger groups, please contact our sales team for custom pricing.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for all new memberships. If you're not satisfied with your membership, contact us within 30 days for a full refund.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes, you can cancel your membership at any time. Your access will continue until the end of your current billing period.",
  },
]

export function MembershipFAQ() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-lg">Find answers to common questions about Scalpel membership.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl px-6 border-none shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
