import { http } from './http-client';

export interface Club {
  accountAddress: string;
  curatorAddress: string;
  tokenMintAccountAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export async function getClubs(): Promise<Club[]> {
  const response = await http.get<Club[]>("clubs");

  return response.data;
}

export async function getClub(accountAddress: string) {
  const response = await http.get<Club>(`clubs/${accountAddress}`);

  return response.data;
}

export async function saveClub(club: Club): Promise<void> {
  await http.post("clubs", club);
}

export async function uploadClubImage(image: File | null): Promise<string> {
  const defaultImageUrl = "https://picsum.photos/id/1/200/300"; // TODO
  if (!image) {
    return defaultImageUrl;
  }
  const formData = new FormData();
  formData.append("file", image);
  const { data } = await http.post<{ url: string }>("media", formData);

  return data.url;
}
