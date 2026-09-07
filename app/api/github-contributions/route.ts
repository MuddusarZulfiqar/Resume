import portfolioData from '@/data/portfolio.json';

// Refresh the cached calendar once a day.
export const revalidate = 86400;

// No date range: GitHub returns the trailing ~53 weeks in the account's own
// timezone — i.e. exactly what renders on the profile page.
const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const disabled = () => Response.json({ enabled: false });

type ApiDay = {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: string;
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const login = portfolioData.github.username;
  if (!token) return disabled();

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate },
    });
    if (!res.ok) return disabled();

    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return disabled();

    const weeks = cal.weeks.map((w: { contributionDays: ApiDay[] }) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        weekday: d.weekday,
        count: d.contributionCount,
        level: LEVEL[d.contributionLevel] ?? 0,
      })),
    );

    return Response.json({
      enabled: true,
      total: cal.totalContributions as number,
      weeks,
    });
  } catch {
    return disabled();
  }
}
