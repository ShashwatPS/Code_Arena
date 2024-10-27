import pclient from "db/src";

async function main(contestId: number) {
    const leaderboardsPoints = new Map<string, number>();
    const contestSubmissions = await pclient.submission.findMany({
        where: {
            contestId,
            isCorrect: true,
        },
        include: {
            user: true,
        },
    });
    contestSubmissions.forEach((submission) => {
        if (!leaderboardsPoints.has(submission.user.username)) {
            leaderboardsPoints.set(submission.user.username, submission.pointsEarned);
        } else {
            const oldValue = leaderboardsPoints.get(submission.user.username);
            leaderboardsPoints.set(submission.user.username, oldValue! + submission.pointsEarned);
        }
    })
}