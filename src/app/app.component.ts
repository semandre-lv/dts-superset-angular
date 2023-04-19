import { Component, OnInit } from "@angular/core";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "CodeSandbox";

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.post(
      "/api/v1/security/login",
      {
        username: "admin",
        password: "admin",
        provider: "db",
        refresh: true
      }
    ).pipe(
      switchMap((token: any) => {
      return this.http.get(
        "/api/v1/security/csrf_token",
        {headers: {
            Authorization: `Bearer ${token.access_token}` // das ist ist das Token aus dem ersten Request
          }}
      ).pipe(
        switchMap(({result: csrf}: any) => {
          return this.http.post(
            "/api/v1/security/guest_token",
            {
              user: {
                username: "admin",
                first_name: "Superset",
                last_name: "Admin"
              },
              rls: [],
              resources: [
                {
                  type: "dashboard",
                  id: "96f6198a-b528-43c0-bc13-1ca8b466bbed"
                }
              ]
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrf,
                Authorization: `Bearer ${(token as any).access_token}`
              }
            }
          )
        }),
        tap(({token}: any) => embedDashboard({
          id: "96f6198a-b528-43c0-bc13-1ca8b466bbed", // given by the Superset embedding UI
          supersetDomain: "http://localhost:8088",
          mountPoint: document.getElementById("apache-dashboard")!, // any html element that can contain an iframe
          fetchGuestToken: () => token,
          dashboardUiConfig: {
            // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
            hideTitle: false,
            filters: {
              expanded: true
            }
          }
        }))
      )
    })
    ).subscribe()
  }
}
