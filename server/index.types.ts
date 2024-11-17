// Custom type for quarter scores to ensure they're numeric strings
type QuarterScore = `${number}`;

// Main interface for NBA game summary
export interface NBAGameSummary {
    _uuid: string;
    date: string;  // YYYY-MM-DD format
    title: string;
    url: string;
    background_image: string;
    game_book: string;
    homeTeam: {
        name: string;
        lineScores: {
            fst_quarter: QuarterScore;
            snd_quarter: QuarterScore;
            trd_quarter: QuarterScore;
            fth_quarter: QuarterScore;
            final: QuarterScore;
        };
    };
    awayTeam: {
        name: string;
        lineScores: {
            fst_quarter: QuarterScore;
            snd_quarter: QuarterScore;
            trd_quarter: QuarterScore;
            fth_quarter: QuarterScore;
            final: QuarterScore;
        };
    };
}