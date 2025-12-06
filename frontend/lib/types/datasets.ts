export type DatasetSummary = {
  id: string;
  name: string;
  imageCount: number;
  createdAt: string;
};

export type ImagePair = {
  id: string;
  originalImageUrl: string;
  fourierImageUrl: string;
  label: string;
};

export type DatasetDetails = {
  id: string;
  name: string;
  imageCount: number;
  createdAt: string;
  pairs: ImagePair[];
};

