//! Binary which exports server's GraphQL schema into a JSON file.
//!
//! # Usage
//!
//! ```bash
//! cargo run --bin export_graphql_schema
//! ```

use std::{fs, io};

/// Runs application be performing introspection GraphQL query onto current
/// GraphQL schema of application and writes result into `graphql.schema.json`
/// file in the project's root.
fn main() -> io::Result<()> {
    let (res, _) = juniper::introspect(
        &api_graphql::schema::new(),
        &api_graphql::dumb::context(),
        juniper::IntrospectionFormat::default(),
    )
        .expect("Failed to execute introspection query");

    fs::write(
        "graphql.schema.json",
        // "data" wrapping is required by GraphDoc.
        // See: https://github.com/2fd/graphdoc/issues/54
        format!(r#"{{"data":{}}}"#, serde_json::to_string_pretty(&res)?),
    )?;

    Ok(())
}
