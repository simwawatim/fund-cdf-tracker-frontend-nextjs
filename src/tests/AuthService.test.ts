import axios from "axios";
import AuthService, { SuccessLoginResponse, ErrorLoginResponse } from "../api/login/login";

// Import jest types for TypeScript
import "@types/jest";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthService.login", () => {
  const username = "testuser";
  const password = "secret";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should reject if username or password is missing", async () => {
    await expect(AuthService.login("", password)).rejects.toEqual<ErrorLoginResponse>({
      statusCd: 400,
      detail: "Username and password are required",
    });

    await expect(AuthService.login(username, "")).rejects.toEqual<ErrorLoginResponse>({
      statusCd: 400,
      detail: "Username and password are required",
    });
  });

  it("should resolve with SuccessLoginResponse on valid credentials", async () => {
    const mockResponse: SuccessLoginResponse = {
      statusCd: 200,
      status: "success",
      access: "mock_access_token",
      user_id: 1,
      role: "admin",
      constituency: 10,
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await AuthService.login(username, password);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/login/v1"),
      { username, password }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should reject if API returns an error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          statusCd: 401,
          detail: "Invalid credentials",
        },
      },
    });

    await expect(AuthService.login(username, password)).rejects.toEqual({
      response: {
        data: {
          statusCd: 401,
          detail: "Invalid credentials",
        },
      },
    });
  });
});
