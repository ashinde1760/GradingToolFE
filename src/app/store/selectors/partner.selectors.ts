import { AppState } from '../index';
import { createSelector } from "@ngrx/store";

const partnerState = (state: AppState) => state.partner

export const loadPartners = createSelector(
    partnerState,
    (state) => state.partner
)

export const loadClientSponsers=createSelector(
    partnerState,
    state => state.clientSponsorList
)
export const loadCenterIncharge=createSelector(
    partnerState,
    state => state.centerInChargeList
)

export const loadTCForPartner=createSelector(
    partnerState,
    state => state.selectedPartnerTC
)