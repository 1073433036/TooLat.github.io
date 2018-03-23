export default class RouteHelper {
  constructor(router: any) {
    this.router = router;
  }
  router: any = null

  public gotoPath(path: string): void {
    this.router.push(path);
  }

  public replacePath(path: string): void {
    this.router.replace(path);
  }

  public gotoHistory(n: number): void {
    this.router.go(n);
  }
}