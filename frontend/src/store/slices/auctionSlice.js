import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auctionService } from "../../services/auctionService";

// Async thunks
export const fetchAllAuctions = createAsyncThunk(
  "auction/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await auctionService.getAllAuctions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAuctionDetails = createAsyncThunk(
  "auction/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await auctionService.getAuctionDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMyAuctions = createAsyncThunk(
  "auction/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await auctionService.getMyAuctions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createNewAuction = createAsyncThunk(
  "auction/create",
  async (auctionData, { rejectWithValue }) => {
    try {
      const response = await auctionService.createAuction(auctionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const placeBidOnAuction = createAsyncThunk(
  "auction/placeBid",
  async ({ auctionId, amount }, { rejectWithValue }) => {
    try {
      const response = await auctionService.placeBid(auctionId, amount);
      return { auctionId, currentBid: response.currentBid };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  auctions: [],
  currentAuction: null,
  myAuctions: [],
  loading: false,
  error: null,
  bidLoading: false,
  bidError: null,
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.bidError = null;
    },
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all auctions
      .addCase(fetchAllAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload.items;
      })
      .addCase(fetchAllAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch auction details
      .addCase(fetchAuctionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuction = action.payload.auctionItem;
      })
      .addCase(fetchAuctionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my auctions
      .addCase(fetchMyAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.myAuctions = action.payload.items;
      })
      .addCase(fetchMyAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create auction
      .addCase(createNewAuction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.myAuctions.push(action.payload.auctionItem);
      })
      .addCase(createNewAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place bid
      .addCase(placeBidOnAuction.pending, (state) => {
        state.bidLoading = true;
        state.bidError = null;
      })
      .addCase(placeBidOnAuction.fulfilled, (state, action) => {
        state.bidLoading = false;
        // Update current auction if it matches
        if (
          state.currentAuction &&
          state.currentAuction._id === action.payload.auctionId
        ) {
          state.currentAuction.currentBid = action.payload.currentBid;
        }
        // Update in auctions list
        const auctionIndex = state.auctions.findIndex(
          (auction) => auction._id === action.payload.auctionId,
        );
        if (auctionIndex !== -1) {
          state.auctions[auctionIndex].currentBid = action.payload.currentBid;
        }
      })
      .addCase(placeBidOnAuction.rejected, (state, action) => {
        state.bidLoading = false;
        state.bidError = action.payload;
      });
  },
});

export const { clearError, clearCurrentAuction } = auctionSlice.actions;
export default auctionSlice.reducer;
