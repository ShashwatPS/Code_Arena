##USER_CODE_HERE##

if __name__ == "__main__":
    size_arr = int(input().strip())
arr = list(map(int, input().strip().split()))[:size_arr]
    result = maxElement(arr)
    print(result)
