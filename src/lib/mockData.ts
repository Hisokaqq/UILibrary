export interface Data {
  id: string;
  title: string;
  date: string;
  status: DataStatus;
}

export const STATUSES = ["pending", "in-progress", "completed"] as const;

export type DataStatus = (typeof STATUSES)[number];

const TITLES = [
  "Project Kickoff",
  "Client Meeting",
  "Code Review",
  "Design Sync",
  "Deploy to Prod",
  "Quarterly Planning",
  "Retrospective",
  "Bug Triage",
];

export const mockData = (n: number): Data[] => {
  const data: Data[] = [];

  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  let currentDate = new Date();

  for (let i = 1; i <= n; i++) {
    if (Math.random() < 0.3) {
      const daysToShift = Math.floor(Math.random() * 20) - 10;
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + daysToShift);
      currentDate = newDate;
    }

    data.push({
      id: `evn-${i}`,
      title: `${pick(TITLES)}: ${Math.floor(Math.random() * 100)}`,
      date: currentDate.toISOString().split("T")[0],
      status: pick(["pending", "in-progress", "completed"] as DataStatus[]),
    });
  }

  return data.sort((a, b) => a.date.localeCompare(b.date));
};
