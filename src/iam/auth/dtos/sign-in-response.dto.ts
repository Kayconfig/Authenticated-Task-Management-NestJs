export class SignInResponseDto {
  data: {
    accessToken: string;
    refreshAccessToken: string;
  };
  constructor(input: { accessToken: string; refreshAccessToken: string }) {
    const { accessToken, refreshAccessToken } = input;
    this.data = { accessToken, refreshAccessToken };
  }
}
