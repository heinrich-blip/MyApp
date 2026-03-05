export interface ChecklistItem {
  id: string;
  question: string;
  weight: number;
  compliance: boolean | null;
  comments: string;
  responsiblePerson: string;
}

export interface ChecklistCategory {
  id: string;
  number: number;
  name: string;
  items: ChecklistItem[];
}

export const createInitialChecklist = (): ChecklistCategory[] => [
  {
    id: "recruitment",
    number: 1,
    name: "Recruitment and Onboarding",
    items: [
      { id: "r1", question: "Have all drivers and staff positions been filled according to approved organizational structure?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "r2", question: "Are all new hires subject to background, criminal, and reference checks?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "r3", question: "Have proof of valid licenses/certifications (e.g., CDL, HGV, medical clearances) been collected and filed?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "r4", question: "Has each new hire completed a formal induction and onboarding program?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "training",
    number: 2,
    name: "Training and Competency",
    items: [
      { id: "t1", question: "Are all drivers trained in defensive driving, safety protocols, and company-specific procedures?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "t2", question: "Are staff trained in regulatory requirements (e.g., DOT, OSHA, local transport laws)?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "t3", question: "Have all mandatory refresher courses and skills assessments been completed and documented?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "t4", question: "Is ongoing professional development encouraged and tracked for all personnel?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "licensing",
    number: 3,
    name: "Licensing, Certification, and Medicals",
    items: [
      { id: "l1", question: "Are all driver licenses, professional certificates, and medical clearances valid and up to date?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "l2", question: "Is there a system to monitor expiry dates and prompt renewals for all required documents?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "l3", question: "Are random drug and alcohol tests conducted in accordance with policy and regulations?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "workforce",
    number: 4,
    name: "Workforce Planning and Scheduling",
    items: [
      { id: "w1", question: "Are work schedules compliant with legal limits on driving hours, rest breaks, and overtime?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "w2", question: "Is there adequate staffing to cover all shifts and routes without overworking personnel?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "w3", question: "Are leave and absence requests managed and documented appropriately?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "health",
    number: 5,
    name: "Health, Safety, and Wellbeing",
    items: [
      { id: "h1", question: "Are regular health and safety briefings or toolbox talks conducted for all staff?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "h2", question: "Are employees provided with personal protective equipment (PPE) and safety gear as required?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "h3", question: "Is there a documented process for reporting and investigating workplace accidents or incidents?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "h4", question: "Are employee wellness programs or support services (e.g., counseling, health checks) available?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "performance",
    number: 6,
    name: "Performance Management",
    items: [
      { id: "p1", question: "Are performance evaluations conducted at least annually for all staff?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
      { id: "p2", question: "Are underperformance issues documented and addressed through coaching or corrective action?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "p3", question: "Are exceptional performers recognized and rewarded according to company policy?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "disciplinary",
    number: 7,
    name: "Disciplinary and Grievance Procedures",
    items: [
      { id: "d1", question: "Is there a clear, documented disciplinary procedure in place and communicated to all staff?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "d2", question: "Are grievances handled promptly, confidentially, and in accordance with policy?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
      { id: "d3", question: "Are all disciplinary and grievance cases recorded and reviewed for trends?", weight: 4, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "compliance",
    number: 8,
    name: "Compliance and Record-Keeping",
    items: [
      { id: "c1", question: "Are all HR records (personnel files, training logs, contracts) complete and securely stored?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "c2", question: "Are all employment practices compliant with labor and transport regulations?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "c3", question: "Are workforce diversity and equal opportunity policies in place and monitored?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "communication",
    number: 9,
    name: "Communication and Engagement",
    items: [
      { id: "co1", question: "Are regular team meetings, briefings, or communications held with all staff?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "co2", question: "Is there a clear channel for employees to provide feedback or suggestions?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "co3", question: "Are changes to policies, procedures, or regulations promptly communicated to all relevant staff?", weight: 3, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
  {
    id: "exit",
    number: 10,
    name: "Exit and Offboarding Procedures",
    items: [
      { id: "e1", question: "Are exit interviews conducted for departing employees?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "e2", question: "Is company property (uniforms, keys, ID cards, devices) retrieved at offboarding?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
      { id: "e3", question: "Are access rights (physical and digital) revoked promptly upon an employee's departure?", weight: 2, compliance: null, comments: "", responsiblePerson: "" },
    ],
  },
];
