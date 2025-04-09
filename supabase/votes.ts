import { supabase } from "./client";
import { DB_REPORTS_TABLE } from "./reports";

export type ReportVote = {
  id: number;
  report_id: number;
  user_id: string;
  upvote: boolean;
  disabled: boolean;
};

export const DB_VOTES_TABLE = "report_votes";

export async function vote(
  reportId: number,
  userId: string,
  upvote: boolean,
  errorCallback: (error: any) => void,
): Promise<boolean> {
  try {
    // check if voting on own report
    const votingOwnReport = await checkVotingOwnReport(reportId, userId);

    if (votingOwnReport) {
      throw new Error("You cannot vote on your own report.");
    }

    // check if already voted on report
    const existingVote = await checkAlreadyVoted(reportId, userId);

    if (existingVote) {
      if (existingVote.upvote === upvote){
        if (!existingVote.disabled) {
          // if user already voted this way, disable the vote
          await disableVote(reportId, userId);
          // remove vote from count
          await setVoteCount(reportId, !upvote);

          return true;
        } else {
          // if user already voted but disabled, enable the vote
          await enableVote(reportId, userId);
          // increment or decrement vote count
          await setVoteCount(reportId, upvote);

          return true;
        }
      } else {
        // if user already voted but with different upvote/downvote, update the vote
        await updateVote(reportId, userId, upvote);
        // increment or decrement vote count twice to update the vote
        await setVoteCount(reportId, upvote);
        await setVoteCount(reportId, upvote);

        return true;
      }
    }

    // otherwise, its a new vote to insert
    await insertVote(reportId, userId, upvote);
    // increment or decrement report votes
    await setVoteCount(reportId, upvote);

    return true;
  } catch (error) {
    errorCallback(error);

    return false;
  }
}

// check if voting on own report
export async function checkVotingOwnReport(
  reportId: number,
  userId: string,
): Promise<boolean> {
  const { data: report, error: reportError } = await supabase
    .from(DB_REPORTS_TABLE)
    .select("id, user_id")
    .eq("id", reportId)
    .single();

  if (reportError) throw reportError;
  if (report.user_id === userId) {
    return true;
  }

  return false;
}

// check if already voted on report
export async function checkAlreadyVoted(
  reportId: number,
  userId: string,
): Promise<ReportVote | null> {
  const { data, error } = await supabase
    .from(DB_VOTES_TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("report_id", reportId);

  if (error) throw error;

  if (data && data.length > 0) {
    return data[0];
  }

  return null;
}

// insert new vote
export async function insertVote(
  reportId: number,
  userId: string,
  upvote: boolean,
): Promise<boolean> {
  const { error } = await supabase.from(DB_VOTES_TABLE).insert({
    report_id: reportId,
    user_id: userId,
    upvote: upvote,
    disabled: false,
  });

  if (error) throw error;

  return true;
}

// update vote with new upvote/downvote
export async function updateVote(
  reportId: number,
  userId: string,
  upvote: boolean,
): Promise<boolean> {
  const { error } = await supabase
    .from(DB_VOTES_TABLE)
    .update({ upvote: upvote, disabled: false })
    .eq("user_id", userId)
    .eq("report_id", reportId);

  if (error) throw error;

  return true;
}

// enable vote
export async function enableVote(
  reportId: number,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(DB_VOTES_TABLE)
    .update({ disabled: false })
    .eq("user_id", userId)
    .eq("report_id", reportId);

  if (error) throw error;

  return true;
}

// disable vote
export async function disableVote(
  reportId: number,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from(DB_VOTES_TABLE)
    .update({ disabled: true})
    .eq("user_id", userId)
    .eq("report_id", reportId);

  if (error) throw error;

  return true;
}

// increment or decrement report votes using supabase function
export async function setVoteCount(
  reportId: number,
  upvote: boolean,
): Promise<boolean> {
  const rpcFunction = upvote
    ? "increment_report_votes"
    : "decrement_report_votes";

  const { error } = await supabase.rpc(rpcFunction, { report_id: reportId });

  if (error) throw error;

  return true;
}
