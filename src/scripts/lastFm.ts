import type { ReceiptData } from "@/types/receipt";
import axios, { type AxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";

interface Params {
	user: string;
	trackCount: number;
	period?: string;
	cardHolder?: string;
	orderNumber?: number;
	authCode?: number;
	thanks?: string;
	setLoading: Dispatch<SetStateAction<boolean>>
}

export default async function fetchLastFmData({
	user,
	trackCount,
	period,
	cardHolder,
	orderNumber,
	authCode,
	thanks,
	setLoading,
}: Params): Promise<{
    receiptData: ReceiptData | null;
    error: string | null;
}> {
	setLoading(true)

	const urlParams = new URLSearchParams({
		user,
		trackCount: String(trackCount),
		period: period || "overall",
		cardHolder: cardHolder || "",
		orderNumber: String(orderNumber),
		authCode: String(authCode),
		thanks: thanks || "",
	});

	try {
		const response = await axios.get(`/api/lastFm/json?${urlParams.toString()}`);
		const data = response.data;

		setLoading(false)

		return {
            receiptData: data,
            error: null
        }
	} catch (e) {
		const error = e as AxiosError;

		setLoading(false)

		const errorData = error.response?.data as {
			code: number;
			message: string;
		}

		return {
            receiptData: null,
            error: errorData.message || "Something went wrong..."
        }
	}
}
