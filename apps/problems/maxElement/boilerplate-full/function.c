#include <stdio.h>
#include <stdlib.h>

##USER_CODE_HERE##

int main() {
    int size_arr;
  scanf("%d", &size_arr);
  int[] arr[size_arr];
  for (int i = 0; i < size_arr; i++) scanf("%int[]", &arr[i]);
    int result = maxElement(arr);
    printf("%int\n", result);
    return 0;
}
