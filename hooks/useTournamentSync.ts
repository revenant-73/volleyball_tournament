import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TournamentState } from "@/types/tournament";

const INITIAL_STATE: TournamentState = {
  teams: [],
  poolMatches: [],
  pools: {},
  bracketMatches: [],
  bracketGenerated: false,
  goldBracketRoots: [],
  silverBracketRoots: [],
};

export function useTournamentSync(tournamentId: string = "default") {
  const [tournamentState, setTournamentState] = useState<TournamentState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "tournaments", tournamentId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTournamentState(docSnap.data() as TournamentState);
      } else {
        setTournamentState(INITIAL_STATE);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tournamentId]);

  const updateState = async (newState: TournamentState) => {
    const docRef = doc(db, "tournaments", tournamentId);
    await setDoc(docRef, newState);
  };

  return { tournamentState, updateState, loading };
}
